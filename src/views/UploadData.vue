<template>
  <div class="platform-step">
    <div class="platform-step-header">
      <div class="platform-step-title">
        <span>MapMyCells</span>
      </div>
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
.platform-left {
  display: flex;
  padding-left: 10%;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}
.platform-left::after {
  content: "";
  position: absolute;
  bottom: 10%;
  left: 45%;
  height: 60%;
  background-color: #cccccc;
  transform: scaleX(1);
  transition: all 0.3s ease;
  width: 1px;
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
.custom-steps :deep(.el-step__title) {
  font-size: 12px;
}
.platform-step-header {
  display: flex;
}
.platform-step {
  margin-bottom: 40px;
}
.platform-step-steps {
  width: 50%;
}
.platform-step-title {
  width: 20%;
}
.platform-container {
  width: 100%;
  height: 70%;
  display: flex;
}
.platform-container > div {
  width: 40%;
}
.platform-step-title > span {
  display: flex;
  padding-left: 26%;
  font-size: 24px;
}
.platform-step-span {
  display: flex;
  font-size: 18px;
  flex-direction: column;
  margin-left: -4%;
  align-items: flex-start;
  width: 60%;
  text-align: left;
}
.platform-left-tip {
  height: 200px;
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 12px;
  width: 360px;
  margin-left: -4%;
}

.platform-right {
  width: 50%;
}
.platform-right-image {
  display: flex;
  flex-direction: column-reverse;
  width: 220px;
  height: 220px;
}
.platform-right-image img {
  width: 180px;
  height: 180px;
}
</style>
