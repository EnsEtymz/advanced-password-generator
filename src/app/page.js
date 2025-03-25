"use client";
import { Fragment, use, useEffect, useRef, useState } from "react";
import PasswordResultModal from "../components/PasswordResultModal";
import "./globals.css";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore, useExpireStore, useLoginModalStore } from "./authStore";
import { ChevronLeft, ChevronRight } from "lucide-react";


const defaultRangeValue = 12;
const defaultIncludeSettings = {
  includeSymbols: false,
  includeNumbers: true,
  includeLowercase: true,
  includeUppercase: true,
};

const defaultExcludeSettings = {
  excludeSimilar: true,
  excludeAmbiguous: true,
};
const includeDescriptions = {
  includeSymbols: "(!, @, #, ...)",
  includeNumbers: "(123456)",
  includeLowercase: "(abcdefgh)",
  includeUppercase: "(ABCDEFGH)",
};
const includeTitles = {
  includeSymbols: "Symbols",
  includeNumbers: "Numbers",
  includeLowercase: "Lowercase",
  includeUppercase: "Uppercase",
};

const excludeDescriptions = {
  excludeSimilar: "(i, l, 1, L, o, 0, O)",
  excludeAmbiguous: "({ } [ ] ( ) / \\ ' \" ` ~ , ; : . < >)",
};
const excludeTitles = {
  excludeSimilar: "Exclude Similar",
  excludeAmbiguous: "Exclude Ambiguous",
};
export default function Home() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [rangeValue, setRangeValue] = useState(defaultRangeValue);
  const rangeRef = useRef(null);
  const token = useAuthStore.getState().token; 
  const [includeSettings, setIncludeSettings] = useState(
    defaultIncludeSettings
  );
  const [excludeSettings, setExcludeSettings] = useState(
    defaultExcludeSettings
  );
  const [generatedPassword, setGeneratedPassword] = useState("");
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";
  const [isOpen, setIsOpen] = useState(false);
  const [passwordName, setPasswordName] = useState("");
  const [hint, setHint] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const setState = useExpireStore((state) => state.setState);
  const setLoginModalState = useLoginModalStore((state) => state.setLoginModalState);

  // İlk açılışta include değerlerini yükle
  useEffect(() => {
    const storedIncludeSettings = Object.keys(defaultIncludeSettings).reduce(
      (acc, key) => {
        const savedValue = Cookies.get(key);
        acc[key] =
          savedValue !== undefined
            ? JSON.parse(savedValue)
            : defaultIncludeSettings[key];
        return acc;
      },
      {}
    );

    setIncludeSettings(storedIncludeSettings);
  }, []);

  // İlk açılışta exclude değerlerini yükle
  useEffect(() => {
    const storedExcludeSettings = Object.keys(defaultExcludeSettings).reduce(
      (acc, key) => {
        const savedValue = Cookies.get(key);
        acc[key] =
          savedValue !== undefined
            ? JSON.parse(savedValue)
            : defaultExcludeSettings[key];
        return acc;
      },
      {}
    );

    setExcludeSettings(storedExcludeSettings);
  }, []);

  useEffect(() => {
    const storedRangeValue = Cookies.get("rangeValue");
    setRangeValue(
      storedRangeValue !== undefined
        ? parseInt(storedRangeValue, 10)
        : defaultRangeValue
    );
  }, []);

  // Include state değiştiğinde çerezlere kaydet
  useEffect(() => {
    Object.entries(includeSettings).forEach(([key, value]) => {
      Cookies.set(key, JSON.stringify(value), { expires: 365 });
    });
  }, [includeSettings]);

  // Exclude state değiştiğinde çerezlere kaydet
  useEffect(() => {
    Object.entries(excludeSettings).forEach(([key, value]) => {
      Cookies.set(key, JSON.stringify(value), { expires: 365 });
    });
  }, [excludeSettings]);

  useEffect(() => {
    Cookies.set("rangeValue", rangeValue, { expires: 365 });
  }, [rangeValue]);

  // Checkbox değiştiğinde ilgili state'i güncelle
  const toggleIncludeSetting = (key) => {
    setIncludeSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExcludeSetting = (key) => {
    setExcludeSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    // Modal dışındaki herhangi bir tuşa basıldığında modalı kapat
    const closeModalOnEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeModalOnEscape);

    return () => {
      document.removeEventListener("keydown", closeModalOnEscape);
    };
  }, []);

  // Range dolgusunu güncelle
  const updateRangeFill = () => {
    if (rangeRef.current) {
      const value = ((rangeValue - 6) / (128 - 6)) * 100;
      rangeRef.current.style.setProperty("--fill", `${value}%`);
    }
  };

  useEffect(() => {
    updateRangeFill();
  }, [rangeValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/\D/g, ""); // Sadece sayıları al
    setRangeValue(newValue); // Anında sınır koyma, kullanıcı rahatça yazsın
  };

  const handleInputBlur = () => {
    setRangeValue((prev) => {
      const parsedValue = parseInt(prev, 10);
      return isNaN(parsedValue) ? 6 : Math.min(Math.max(parsedValue, 6), 128);
    });
  };

  const handleRangeChange = (e) => {
    setRangeValue(parseInt(e.target.value, 10)); // String kalmasını önlemek için parseInt
  };

  const generatePassword = async (command) => {
    const convertToSnakeCase = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase(); // CamelCase → snake_case
        acc[snakeKey] = value;
        return acc;
      }, {});
    };

    const requestData = {
      password_length: rangeValue.toString(),
      ...convertToSnakeCase(includeSettings), // include_* ayarlarını dönüştür
      ...convertToSnakeCase(excludeSettings), // exclude_* ayarlarını dönüştür
    };

    try {
      const response = await fetch(`${baseUrl}/password-generator/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        toast.error("Password could not be generated!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
        return;
      }

      const res = await response.json();
      if (res.is_success && res.data) {
        if (command === "copy") {
          navigator.clipboard.writeText(res.data);
          toast.success("Password copied to clipboard!", {
            style: {
              background: "#34c75a",
              color: "#fff",
            },
          });

          return;
        }
        setGeneratedPassword(res.data);
        setVisibleModal(true);
      } else {
        setGeneratedPassword("Password could not be generated!");
        toast.error("Password could not be generated!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setGeneratedPassword("An error occurred!");
      toast.error("An error occurred!", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    }
  };



  const savePassword = async () => {
    const token = await useAuthStore.getState().token;
    if (!token) {
      toast.error("Please log in.", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      setLoginModalState(true);
      return;
    }
    if (!passwordName) {
      toast.error("Please enter a name for your password!", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      return;
    }
    const requestData = {
      name: passwordName,
      password: generatedPassword,
      hint: hint,
      tag_ids: selectedTags,
    };

    try {
      const response = await fetch(`${baseUrl}/password-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const res = await response.json();
      if (res.is_success && res.data) {
        toast.success("Password saved successfully!", {
          style: {
            background: "#34c75a",
            color: "#fff",
          },
        });
      } else if (res.status_code == 401) {
        setState(true);
      }else {
        toast.error("Password could not be saved!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col items-center md:justify-center ">
        <div className="bg-white  p-8 rounded-lg md:shadow-lg w-full md:h-auto lg:w-1/2 dark:bg-black  dark:border-2 ">
          <div className="w-full gap-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl lg:text-2xl font-bold">
                Password Generator
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    id="dropdownMenuIconButton"
                    data-modal-target="settings-modal"
                    data-modal-toggle="settings-modal"
                    className="font-bold hover:bg-[#F0F2F5] text-gray-500 dark:text-white px-2 py-2 rounded-md flex items-center justify-center text-center  dark:hover:bg-[#1a1a1a]"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-md">
                  <DialogHeader className={"border-b border-gray-200 pb-4"}>
                    <DialogTitle>Settings</DialogTitle>
                  </DialogHeader>
                  <div>
                    <div className="flex flex-col justify-start gap-3">
                      {Object.keys(excludeSettings).map((key) => (
                        <label
                          key={key}
                          className="inline-flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={excludeSettings[key]}
                            onChange={() => toggleExcludeSetting(key)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-500 rounded-full peer peer-checked:bg-black dark:peer-checked:bg-gray-800 after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                          <span className="ms-3 text-sm font-medium text-gray-500 dark:text-white">
                            {excludeTitles[key]}{" "}
                            {excludeDescriptions[key]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <div className="w-full flex justify-end mt-4">
                      <button
                        id="save-settings-button"
                        onClick={() => {
                          if (token) {
                            toast.success("Settings saved successfully!", {
                              style: {
                                background: "#34c75a",
                                color: "#fff",
                              },
                            });
                            setIsOpen(false);
                          } else {
                            toast.error("Please enter your token!", {
                              style: {
                                background: "#000",
                                color: "#fff",
                              },
                            });
                          }
                        }}
                        type="submit"
                        className="w-full text-sm font-semibold bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200 text-white py-2 rounded-md text-center items-center"
                      >
                        Save
                      </button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="mt-2">Generate unlimited and secure password.</p>
          </div>
          <div>
            <div className="flex flex-col gap-6 py-6">
              <div className="w-5/6 md:w-2/3">
                <label className="block text-sm font-medium text-gray-500 dark:text-white mb-3">
                  Length:
                  <input
                    type="text"
                    className="bg-transparent px-0.5 focus:ring-1 max-w-[2.5rem] text-center"
                    value={rangeValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </label>
                <div className="flex items-center space-x-2 bg-white dark:bg-black ">
                  <input
                    ref={rangeRef}
                    type="range"
                    min={6}
                    max={128}
                    value={rangeValue}
                    onChange={handleRangeChange}
                    className="flex-1  h-2 rounded-full cursor-pointer"
                  />
                  <div className="flex gap-0.5">
                    <button
                      className="font-bold hover:bg-[#F0F2F5] text-gray-500 dark:text-white px-2 h-7 rounded-md flex items-center justify-center"
                      onClick={() =>
                        setRangeValue((prev) =>
                          Math.max(parseInt(prev, 10) - 1, 6)
                        )
                      }
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="font-bold hover:bg-[#F0F2F5] text-gray-500 dark:text-white px-2 h-7 rounded-md flex items-center justify-center"
                      onClick={() =>
                        setRangeValue((prev) =>
                          Math.min(parseInt(prev, 10) + 1, 128)
                        )
                      }
                    >
                      <ChevronRight size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-24">
              <div className="grid grid-cols-1 gap-3">
                {Object.keys(includeSettings).map((key) => (
                  <label
                    key={key}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={includeSettings[key]}
                      onChange={() => toggleIncludeSetting(key)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-500 rounded-full peer peer-checked:bg-black dark:peer-checked:bg-gray-800 after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    <span className="ms-3 text-sm font-medium text-gray-500 dark:text-white">
                      {includeTitles[key]}{" "}
                      {includeDescriptions[key]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full mt-6">
            <button
              id="generate-button"
              onClick={generatePassword}
              type="button"
              className="w-36 font-semibold text-sm bg-black hover:bg-black/80 transition duration-200 text-white py-2 rounded-md text-center items-center"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => {
                setVisibleModal(false);
                generatePassword("copy");
              }}
              id="generate-copy-button"
              className="w-36 text-sm font-semibold bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200 text-white py-2 rounded-md text-center items-center"
            >
              Generate & Copy
            </button>
          </div>
        </div>
      </div>
      <PasswordResultModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        generatedPassword={generatedPassword}
        passwordName={passwordName}
        setPasswordName={setPasswordName}
        savePassword={savePassword}
        hint={hint}
        setHint={setHint}
        tags={tags}
        setTags={setTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    </Fragment>
  );
}
