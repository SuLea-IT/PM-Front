import { ElMessage } from "element-plus";
import i18n from "../i18n/i18n";
import axiosInstance from "./axiosInstance";

const translateServerMessage = (message) => {
  switch (message) {
    case "???":
      return i18n.global.t("uploadInProgress");
    case "????????":
      return i18n.global.t("allFilesUploadedSuccessfully");
    case "??????":
      return i18n.global.t("fileAlreadyExists");
    default:
      if (
        i18n.global.locale.value === "en" &&
        /[一-鿿]/.test(message || "")
      ) {
        return i18n.global.t("uploadFailedRetry");
      }
      return message;
  }
};

const uploadFileInChunks = async (
  file,
  currentFileIndex,
  totalFiles,
  email,
  fileType,
  fileNumber,
  fun
) => {
  const chunkSize = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / chunkSize);
  let progressNoticeCount = 0;

  const uploadChunk = async (index) => {
    if (index >= totalChunks) {
      return;
    }

    const start = index * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("index", index);
    formData.append("totalChunks", totalChunks);
    formData.append("fileName", file.name);
    formData.append("fileSize", file.size);
    formData.append("type", fileType);
    formData.append("number", fileNumber);
    formData.append("currentFileIndex", currentFileIndex);
    formData.append("totalFiles", totalFiles);
    formData.append("email", email);
    formData.append("fun", fun);

    try {
      const response = await axiosInstance.post("/upload/upload", formData);
      const translatedMessage = translateServerMessage(response.msg);

      if (response.code === 200) {
        if (response.msg === "???") {
          await uploadChunk(index + 1);
          progressNoticeCount += 1;
          if (progressNoticeCount % 3 === 0) {
            ElMessage.success(translatedMessage);
          }
        } else if (response.msg === "????????") {
          ElMessage.success(i18n.global.t("fileUploadSuccess"));
        }
      } else {
        ElMessage.error(translatedMessage || i18n.global.t("uploadFailedRetry"));
      }
    } catch (error) {
      console.error("Upload chunk failed:", error);
      ElMessage.error(i18n.global.t("uploadFailedRetry"));
    }
  };

  await uploadChunk(0);
};

const uploadFiles = (files, email, fileType, fileNumber, fun) => {
  if (files.length === 0) {
    ElMessage.error(i18n.global.t("noFilesUploaded"));
    return;
  }

  const totalFiles = files.length;
  const sortedFiles = Array.from(files).sort((a, b) => b.size - a.size);

  const uploadNextFile = (index) => {
    if (index >= totalFiles) return;

    uploadFileInChunks(
      sortedFiles[index],
      index + 1,
      totalFiles,
      email,
      fileType,
      fileNumber,
      fun
    ).then(() => {
      setTimeout(() => {
        uploadNextFile(index + 1);
      }, 300);
    });
  };

  uploadNextFile(0);
};

export { uploadFiles };
