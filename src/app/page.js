"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import PasswordResultModal from "../components/PasswordResultModal";
import "./globals.css";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";

const defaultRangeValue = 12;
const defaultToken = "";
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

export default function Home() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [rangeValue, setRangeValue] = useState(defaultRangeValue);
  const rangeRef = useRef(null);
  const [token, setToken] = useState(defaultToken);
  const [includeSettings, setIncludeSettings] = useState(
    defaultIncludeSettings
  );
  const [excludeSettings, setExcludeSettings] = useState(
    defaultExcludeSettings
  );
  const [generatedPassword, setGeneratedPassword] = useState("");
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://unified-api.beratcarsi.com/password-generator";
  const [isOpen, setIsOpen] = useState(false);
  const [passwordName, setPasswordName] = useState("");
  console.log("env", process.env.NEXT_PUBLIC_API_URL);

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
    const storedToken = Cookies.get("token");
    setToken(storedToken !== undefined ? storedToken : defaultToken);
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
    Cookies.set("token", token, { expires: 365 });
  }, [rangeValue, token]);

  // Checkbox değiştiğinde ilgili state'i güncelle
  const toggleIncludeSetting = (key) => {
    setIncludeSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExcludeSetting = (key) => {
    setExcludeSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = (e) => {
    // Eğer modal dışına tıklanırsa, modalı kapat
    if (e.target.id === "overlay") {
      setIsOpen(false);
    }
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

  // Input değişimlerini işleme
  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/\D/g, ""); // Sadece sayıları al
    setRangeValue(
      newValue ? Math.min(Math.max(parseInt(newValue, 10), 6), 128) : 6
    );
  };

  // Enter veya blur olduğunda güncelle
  const handleInputBlur = () => {
    setRangeValue((prev) => Math.min(Math.max(prev, 6), 128));
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
        toast.error("Password could not be generated!");
        return;
      }

      const res = await response.json();
      if (res.is_success && res.data) {
        if (command === "copy") {
          navigator.clipboard.writeText(res.data);
          toast.success("Password copied to clipboard!");
          return;
        }
        setGeneratedPassword(res.data);
        setVisibleModal(true);
      } else {
        setGeneratedPassword("Password could not be generated!");
        toast.error("Password could not be generated!");
      }
    } catch (error) {
      console.error("Error:", error);
      setGeneratedPassword("An error occurred!");
      toast.error("An error occurred!");
    }
  };

  const savePassword = async () => {
    if (!token) {
      toast.error("Please enter your token!");
      return;
    }
    if (!passwordName) {
      toast.error("Please enter a name for your password!");
      return;
    }
    const requestData = {
      api_key: token,
      title: passwordName,
      password: generatedPassword,
      hint: "Generated password",
    };

    try {
      const response = await fetch(`${baseUrl}/password-generator/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        toast.error("Password could not be saved!");
        return;
      }

      const res = await response.json();
      if (res.is_success && res.data) {
        toast.success("Password saved successfully!");
      } else {
        toast.error("Password could not be saved!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!");
    }
  };

  return (
    <Fragment>
      <Navbar />

      <div className="flex flex-col items-center md:justify-center lg:pt-12">
        <div className="bg-white p-8 rounded-lg md:shadow-lg w-full md:h-auto lg:w-1/2">
          <div className="w-full gap-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl lg:text-2xl font-bold">
                Password Generator
              </h2>
              <button
                id="dropdownMenuIconButton"
                onClick={() => setIsOpen(true)}
                data-modal-target="settings-modal"
                data-modal-toggle="settings-modal"
                className="font-bold hover:bg-[#F0F2F5] text-gray-500 px-2 py-2 rounded-md flex items-center justify-center text-center"
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

              {isOpen && (
                <div
                  id="settings-modal"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                  onClick={handleClose}
                >
                  <div
                    id="overlay"
                    className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"
                  ></div>

                  <div className="relative p-4 w-full max-w-md max-h-full z-50">
                    <div className="relative bg-white rounded-lg shadow-sm">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <h3 className="text-xl font-semibold">Settings</h3>
                        <button
                          type="button"
                          className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                          onClick={() => setIsOpen(false)}
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      <div className="p-4 md:p-5">
                        <div className="flex flex-col justify-start gap-3">
                          <input
                            type="text"
                            name="token"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="border border-gray-500 text-black placeholder-gray-500 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block w-full p-2 mb-3"
                            placeholder="Your token"
                            required
                          />
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
                              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                              <span className="ms-3 text-sm font-medium text-gray-500">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                            </label>
                          ))}
                          <div className="w-full flex justify-end mt-4">
                            <button
                              id="save-settings-button"
                              onClick={() => {
                                if (token) {
                                  toast.success("Settings saved successfully!");
                                  setIsOpen(false);
                                } else {
                                  toast.error("Please enter your token!");
                                }
                              }}
                              type="submit"
                              className="w-full text-sm font-semibold bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200 text-white py-2 rounded-md text-center items-center"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2">Generate unlimited and secure password.</p>
          </div>
          <div>
            <div className="flex flex-col gap-6 py-6">
              <div className="w-5/6 md:w-2/3">
                <label className="block text-sm font-medium text-gray-500 mb-3">
                  Length:
                  <input
                    type="text"
                    className=" bg-transparent px-0.5 focus:ring-1 max-w-[2.5rem] text-center"
                    value={rangeValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </label>
                <div className="flex items-center space-x-2 bg-white">
                  <input
                    ref={rangeRef}
                    type="range"
                    min={6}
                    max={128}
                    value={rangeValue}
                    onChange={(e) => setRangeValue(e.target.value)}
                    className="flex-1 bg-red-500 h-2 rounded-full cursor-pointer"
                  />
                  <div className="flex gap-0.5">
                    <button
                      className="font-bold hover:bg-[#F0F2F5] text-gray-500 px-2 h-7 rounded-md flex items-center justify-center"
                      onClick={() =>
                        setRangeValue((prev) => Math.max(prev - 1, 6))
                      }
                    >
                      &lt;
                    </button>
                    <button
                      className="font-bold hover:bg-[#F0F2F5] text-gray-500 px-2 h-7 rounded-md flex items-center justify-center"
                      onClick={() =>
                        setRangeValue((prev) => Math.min(prev + 1, 128))
                      }
                    >
                      &gt;
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
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    <span className="ms-3 text-sm font-medium text-gray-500">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
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
              Generate &amp; Copy
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
      />
    </Fragment>
  );
}
