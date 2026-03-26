<template>
  <div class="upload-page">
    <div class="platform-step">
      <div class="platform-step-header">

        <div class="platform-step-steps">
          <el-steps
            class="custom-steps"
            :active="currentStep"
            align-center
            finish-status="success"
          >
            <el-step
              v-for="(step, index) in steps"
              :key="index"
              :title="$t(`steps.${step.title}`)"
            />
          </el-steps>
        </div>
      </div>
    </div>
    <div class="platform-container">
      <div class="platform-left">
        <div class="platform-step-span">
          <span class="platform-step-span-title">{{ $t("uploadStepOneTitle") }}</span>
          <span class="platform-step-span-text">
            {{ $t("uploadStepOneDescription") }}
          </span>
        </div>
        <div class="platform-left-select">
          <DataUpload
            ref="dataUploadRef"
            v-model="selectedValues[3]"
            :selected-file-type="Number(selectedValues[2])"
            :selected-fun="selectedFun"
            :file-type-cluster="fileTypeCluster"
            :file-type-gene="fileTypeGene"
            :show-file-list="showFileList"
            :upload-flag="uploadFlag"
            @click="resetUploadFlagIfNeeded"
          />
        </div>
        <div class="platform-left-tip">
          <span>{{ $t("dataUsagePrivacyTitle") }}</span>
          <span>{{ $t("dataUsagePrivacyContent") }}</span>
        </div>
      </div>
      <div class="platform-right">
        <div class="platform-step-span">
          <span class="platform-step-span-title">{{ $t("uploadStepTwoTitle") }}</span>
          <span class="platform-step-span-text">
            {{ $t("uploadStepTwoDescription") }}
          </span>
        </div>
        <div class="platform-left-select">
          <div class="platform-right-image">
            <img src="/UMAP.png" alt="" />
          </div>
          <DataSelect
            v-model="selectedValues[4]"
            :options="funOptions"
            :tag-text="$t('functionality')"
            :placeholder-text="$t('select')"
          />
          <DataSelect
            v-model="selectedValues[2]"
            :options="options"
            :tag-text="$t('dataSet')"
            :placeholder-text="$t('select')"
          />
          <DataInput
            v-model="Inputvalue"
            :tag-text="$t('enterEmailAddress')"
            :placeholder-text="$t('select')"
            :validateFn="validateEmail"
          />
          <el-button @click="handleUpload">{{ $t("upload") }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import DataInput from "../components/element/DataInput.vue";
import DataSelect from "../components/element/DataSelect.vue";
import DataUpload from "../components/element/DataUpload.vue";
import { validateEmail } from "../rule/emailValidator.js";
import { uploadFiles } from "../utils/uploadUtil.js";

const { t } = useI18n();
const currentStep = ref(1);
const steps = [
  { title: "selectData", description: "" },
  { title: "uploadData", description: "" },
  { title: "configureEmail", description: "" },
];

const selectedValues = ref(["", "", "1", [], "1"]);
const Inputvalue = ref("");
const showFileList = ref(true);
const uploadFlag = ref(false);
const selectedFun = ref(Number(selectedValues.value[4]));

const options = computed(() => [
  { value: "1", label: t("singleCellData") },
  { value: "2", label: t("singleCellSpatialData") },
  { value: "3", label: t("btSpatialData") },
  { value: "4", label: t("xeniumDataLabel") },
  { value: "5", label: t("h5adData") },
]);

const funOptions = computed(() => [
  { value: "1", label: t("cluster") },
  { value: "2", label: t("singleGeneMapping") },
  { value: "3", label: t("multiGeneMapping") },
]);

const fileTypeGenes = {
  1: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text"],
    requiredFileNames: ["barcodes", "features", "matrix", "*", "*"],
    uploadFileCount: 5,
  },
  2: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text", ".npy"],
    requiredFileNames: [
      "barcodes",
      "features",
      "matrix",
      "barcodes_pos",
      "*",
      "*",
      "*",
    ],
    uploadFileCount: 7,
  },
  3: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text"],
    requiredFileNames: ["barcodes", "features", "matrix", "*", "*"],
    uploadFileCount: 6,
  },
  4: {
    allowedExtensions: [".csv.gz", ".mtx.gz", ".h5", ".txt", ".text"],
    requiredFileNames: ["*", "*"],
    uploadFileCount: 4,
  },
  5: {
    allowedExtensions: [".h5ad", ".txt", ".text"],
    requiredFileNames: ["*", "*"],
    uploadFileCount: 3,
  },
};

const fileTypeGene = {
  1: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text"],
    requiredFileNames: ["barcodes", "features", "matrix", "*", "*"],
    uploadFileCount: 5,
  },
  2: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text", ".npy"],
    requiredFileNames: [
      "barcodes",
      "features",
      "matrix",
      "barcodes_pos",
      "*",
      "*",
      "*",
    ],
    uploadFileCount: 6,
  },
  3: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text"],
    requiredFileNames: ["barcodes", "features", "matrix", "*", "*"],
    uploadFileCount: 6,
  },
  4: {
    allowedExtensions: [".csv.gz", ".mtx.gz", ".h5", ".txt", ".text"],
    requiredFileNames: ["*", "*"],
    uploadFileCount: 4,
  },
  5: {
    allowedExtensions: [".h5ad", ".txt", ".text"],
    requiredFileNames: ["*", "*"],
    uploadFileCount: 3,
  },
};

const fileTypeCluster = {
  1: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text"],
    requiredFileNames: ["barcodes", "features", "matrix", "*"],
    uploadFileCount: 4,
  },
  2: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".npy", ".txt", ".text"],
    requiredFileNames: [
      "barcodes",
      "features",
      "matrix",
      "barcodes_pos",
      "*",
      "*",
    ],
    uploadFileCount: 6,
  },
  3: {
    allowedExtensions: [".tsv.gz", ".mtx.gz", ".txt", ".text"],
    requiredFileNames: ["barcodes", "features", "matrix", "*"],
    uploadFileCount: 5,
  },
  4: {
    allowedExtensions: [".csv.gz", ".mtx.gz", ".h5", ".txt", ".text"],
    requiredFileNames: ["*", "*"],
    uploadFileCount: 3,
  },
  5: {
    allowedExtensions: [".h5ad", ".txt", ".text"],
    requiredFileNames: ["*", "*"],
    uploadFileCount: 2,
  },
};

const fileType = ref(1);
const fileNumber = ref(4);

watch(
  () => selectedValues.value[2],
  (newValue) => {
    if (newValue) {
      let restriction;
      if (selectedFun.value === 1) {
        restriction = fileTypeCluster[Number(newValue)];
      } else if (selectedFun.value === 2) {
        restriction = fileTypeGene[Number(newValue)];
      } else if (selectedFun.value === 3) {
        restriction = fileTypeGenes[Number(selectedValues.value[2])];
      }

      if (restriction) {
        fileType.value = Number(newValue);
        fileNumber.value = restriction.uploadFileCount;
        currentStep.value = 1;
      }
    } else {
      fileType.value = 1;
      fileNumber.value = fileTypeCluster[1].uploadFileCount;
      currentStep.value = 0;
    }
  }
);

watch(
  () => selectedValues.value[4],
  (newValue) => {
    selectedFun.value = Number(newValue);

    let restriction;
    if (selectedFun.value === 1) {
      restriction = fileTypeCluster[Number(selectedValues.value[2])];
    } else if (selectedFun.value === 2) {
      restriction = fileTypeGene[Number(selectedValues.value[2])];
    } else if (selectedFun.value === 3) {
      restriction = fileTypeGenes[Number(selectedValues.value[2])];
    }

    fileNumber.value = restriction ? restriction.uploadFileCount : 1;
  }
);

const isFileUploaded = ref(false);

watch(Inputvalue, (newValue) => {
  if (validateEmail(newValue) && isFileUploaded.value) {
    currentStep.value = 2;
  }
});

const resetUploadFlagIfNeeded = () => {
  if (selectedValues.value[3].length === 0) {
    uploadFlag.value = false;
  }
};

const handleUpload = () => {
  const email = Inputvalue.value;
  const files = selectedValues.value[3];

  if (!files || files.length === 0) {
    ElMessage.error(t("noFilesUploaded"));
    return;
  }

  if (files.length !== fileNumber.value) {
    ElMessage.error(t("uploadAtLeastFiles", { count: fileNumber.value }));
    return;
  }

  const areAllFilesValid = Array.from(files).every((file) =>
    validateFile(selectedFun.value, file, fileType.value)
  );

  if (!areAllFilesValid) {
    ElMessage.error(t("invalidFileTypeOrName"));
    return;
  }

  isFileUploaded.value = true;

  if (!validateEmail(email)) {
    ElMessage.error(t("emailRequired"));
    return;
  }

  uploadFiles(
    files,
    email,
    fileType.value,
    fileNumber.value,
    selectedFun.value
  );

  const uploadComponent = document.querySelector(
    ".upload-demo .el-upload-list"
  );

  if (uploadComponent) {
    uploadComponent.innerHTML = "";
    uploadFlag.value = true;
    selectedValues.value[3] = [];
  }
};

const validateFile = (fun, file, currentFileType) => {
  let restrictions;

  if (fun === 1) {
    restrictions = fileTypeCluster[currentFileType];
  } else if (fun === 2) {
    restrictions = fileTypeGene[currentFileType];
  } else if (fun === 3) {
    restrictions = fileTypeGenes[currentFileType];
  }

  const fileName = file.name.toLowerCase();
  const fileExtension = `.${fileName.substring(fileName.indexOf(".") + 1)}`;

  const isValidType = restrictions.allowedExtensions.includes(fileExtension);
  const matchesRequiredName = restrictions.requiredFileNames.some(
    (name) => name === "*" || fileName.includes(name)
  );

  return isValidType && matchesRequiredName;
};
</script>

<style scoped>
.steps-card {
  max-width: 500px;
  margin: auto;
}
.upload-page {
  min-height: calc(100vh - 76px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 42px;
  padding: 52px 56px 76px;
  box-sizing: border-box;
}
.platform-step {
  width: 100%;
  max-width: 1460px;
  margin: 0 auto;
}
.platform-step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-direction: column;
}
.platform-step-title {
  flex: 0 0 300px;
}
.platform-step-title > span {
  display: flex;
  align-items: center;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.platform-step-steps {
  width: 100%;
  max-width: 1080px;
}
.platform-step-steps :deep(.el-steps) {
  width: 100%;
}
.custom-steps :deep(.el-step__title) {
  font-size: 16px;
}
.custom-steps :deep(.el-step__head) {
  transform: scale(1.12);
}

.platform-container {
  width: 100%;
  max-width: 1460px;
  min-height: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 92px;
  margin: 0 auto;
  padding: 0;
}
.platform-container > div {
  flex: 0 1 auto;
  min-width: 0;
}

.platform-left {
  display: flex;
  flex-direction: column;
  width: 760px;
  padding: 8px 52px 8px 8px;
  position: relative;
}
.platform-left::after {
  content: "";
  position: absolute;
  top: 12px;
  right: -46px;
  height: 700px;
  background-color: #cccccc;
  transform: scaleX(1);
  transition: all 0.3s ease;
  width: 1px;
}
.platform-right {
  display: flex;
  flex-direction: column;
  width: 500px;
  padding: 8px 8px 8px 52px;
}

.platform-left-select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  width: 100%;
}
.platform-left :deep(.el-select__wrapper) {
  box-shadow: none;
  background: none;
}
.platform-right :deep(.el-select__wrapper) {
  box-shadow: none;
  background: none;
}

.platform-right :deep(.el-input__wrapper) {
  box-shadow: none;
  background: none;
}
.platform-step-span {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 600px;
  text-align: left;
  margin-bottom: 28px;
}
.platform-step-span-title {
  font-size: 34px;
  font-weight: 600;
  line-height: 1.3;
}
.platform-step-span-text {
  font-size: 21px;
  line-height: 1.55;
  color: #606266;
}
.platform-left-tip {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
  font-size: 18px;
  line-height: 1.9;
  width: 100%;
  max-width: 600px;
  margin-top: 52px;
  padding-top: 0;
}
.platform-left-tip > span:first-child {
  font-size: 28px;
  font-weight: 600;
}
.platform-right-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 380px;
  height: 300px;
  margin: 0 0 22px;
}
.platform-right-image img {
  width: 320px;
  height: 320px;
  object-fit: contain;
}

.platform-right :deep(.platform-left-tag) {
  max-width: 430px;
}

.platform-right :deep(.el-tag) {
  font-size: 15px;
  padding: 0 16px;
  height: 32px;
  line-height: 30px;
}

.platform-right :deep(.el-select),
.platform-right :deep(.el-input) {
  width: 430px !important;
}

.platform-right :deep(.el-select__wrapper),
.platform-right :deep(.el-input__wrapper) {
  min-height: 52px;
  font-size: 22px;
}

.platform-right :deep(.el-input__inner),
.platform-right :deep(.el-select__placeholder),
.platform-right :deep(.el-select__selected-item) {
  font-size: 22px;
}

.platform-left :deep(.upload-demo) {
  max-width: 640px;
}

.platform-left :deep(.el-upload-dragger) {
  min-height: 260px;
  padding: 44px 34px;
}

.platform-left :deep(.el-icon--upload svg) {
  width: 86px;
  height: 86px;
}

.platform-left :deep(.el-upload__text) {
  font-size: 28px;
  line-height: 1.6;
}

.platform-left :deep(.el-upload__tip) {
  font-size: 18px;
  line-height: 1.6;
}

.platform-right :deep(.el-button) {
  width: 430px;
  min-height: 54px;
  margin-top: 10px;
  font-size: 20px;
}

@media (max-width: 1100px) {
  .upload-page {
    justify-content: flex-start;
    padding: 48px 24px 56px;
  }

  .platform-container {
    gap: 36px;
    max-width: 1120px;
  }

  .platform-left,
  .platform-right {
    padding: 8px 0;
  }

  .platform-left {
    width: 620px;
  }

  .platform-right {
    width: 400px;
  }

  .platform-left::after {
    display: none;
  }
}

@media (max-width: 900px) {
  .upload-page {
    gap: 22px;
    padding: 36px 20px 40px;
  }

  .platform-step-header,
  .platform-container {
    flex-direction: column;
  }

  .platform-step {
    margin-bottom: 0;
  }

  .platform-step-title,
  .platform-step-steps,
  .platform-left,
  .platform-right {
    width: 100%;
    max-width: none;
  }

  .platform-left,
  .platform-right {
    min-height: auto;
    padding: 0;
  }

  .platform-step-title > span {
    font-size: 30px;
  }

  .platform-step-span-title {
    font-size: 24px;
  }

  .platform-step-span-text,
  .platform-left-tip {
    font-size: 16px;
  }

  .platform-left-tip {
    margin-top: 12px;
  }

  .platform-right-image {
    margin-bottom: 10px;
  }

  .platform-right :deep(.el-select),
  .platform-right :deep(.el-input),
  .platform-right :deep(.el-button) {
    width: 100% !important;
  }
}
</style>
