import { useState } from "react";
import { toast } from "sonner";

const PasswordResultModal = ({
  visibleModal,
  setVisibleModal,
  generatedPassword,
  passwordName,
  setPasswordName,
  savePassword,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyButton = () => {
    if (!generatedPassword) return; // Eğer şifre boşsa, kopyalama işlemi yapma

    navigator.clipboard
      .writeText(generatedPassword)
      .then(() => {
        toast.success("Password copied to clipboard.", {
          style: {
            background: '#34c75a',
            color: '#fff',
          },
        });
        setIsCopied(true);

        // 2 saniye sonra butonları eski haline döndür
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        toast.error("An error occurred while copying the password.", {
          style: {
            background: '#000',
            color: '#fff',
          },
        });
      });
  };

  return (
    <div
      id="password-modal"
      className={
        "flex-col w-full items-center justify-center pt-6 pb-12 " +
        (visibleModal == false ? "hidden" : "flex")
      }
    >
      <div
        id="password-content"
        className="bg-white p-8 rounded-lg md:shadow-lg w-full lg:w-1/2 min-h-64"
      >
        <div className="w-full gap-4 border-b pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl font-bold">
              Generated Your Password
            </h2>
            <button
              onClick={() => setVisibleModal(false)}
              className="font-bold hover:bg-[#F0F2F5] text-gray-500 px-2 py-2 rounded-md flex items-center justify-center text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-2">You can copy and use your password.</p>
        </div>
        <div className="w-full">
          <div className="flex py-6 w-full">
            <span
              id="password-display"
              className="max-w-64 md:max-w-[720px] lg:max-w-[640px] block break-words"
            >
              {generatedPassword}
            </span>
            {/* Kopyalama butonu */}
            <button
              id="copy-button"
              className={`ml-4 hover:text-[#34c75a] transition duration-200 ${
                isCopied ? "hidden" : ""
              }`}
              onClick={copyButton}
            >
              <svg
                viewBox="0 0 24 24"
                width={20}
                height={20}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="css-i6dzq1"
              >
                <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            {/* Kopyalandı butonu */}
            <button
              id="copied-button"
              className={`ml-4 hover:text-[#34c75a] transition duration-200 ${
                isCopied ? "" : "hidden"
              }`}
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
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          id="save-area"
          className="flex flex-col md:flex-row gap-4 items-center max-w-full"
        >
          <div className="relative flex items-center w-full md:w-auto lg:max-w-full overflow-hidden">
            <input
              type="text"
              id="passwordNameInput"
              value={passwordName}
              onChange={(e) => setPasswordName(e.target.value)}
              className="border border-gray-500 text-black placeholder-gray-500 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 p-2 w-auto min-w-full md:min-w-44 max-w-full transition-all duration-200"
              placeholder="Password name"
            />
          </div>
          <button
            id="saved-button"
            onClick={() => savePassword()}
            type="submit"
            className="w-full md:w-36 text-sm font-semibold bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200 text-white p-2 rounded-md text-center flex items-center justify-center"
          >
            <span id="button-text">Save</span>
            <svg
              id="check-icon"
              className="w-5 h-5 text-white mx-auto hidden"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/*Skeleton*/}
      <div
        id="password-skeleton"
        className="bg-white rounded-lg shadow-lg w-full lg:w-1/2 hidden h-64  flex-col items-center justify-center"
      >
        <div role="status ">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin fill-[#34c75a] mx-auto"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
};
export default PasswordResultModal;
