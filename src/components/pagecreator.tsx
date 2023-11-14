import {
  ltrCssLoader,
  rsErrorMessage,
  RsLocalizationWrapper,
  rsTooltip,
  rSuiteComponents,
  rtlCssLoader,
} from "@react-form-builder/components-rsuite";
import {
  ActionDefinition,
  BiDi,
  ComponentLocalizer,
  ExternalValidators,
  IFormViewer,
} from "@react-form-builder/core";
import {
  BuilderView,
  FormBuilder,
  IFormStorage,
} from "@react-form-builder/designer";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { IndexedDbFormStorage } from "./keyValueStorage";
import { talButton } from "./Custom/Components/RichTextBoxEditor";

const componentsMetadata = [
  ...rSuiteComponents.map((definer) => definer.build()),
  talButton.build(),
];

const builderView = new BuilderView(componentsMetadata)
  .withErrorMeta(rsErrorMessage.build())
  .withTooltipMeta(rsTooltip.build())
  .withTemplates([])
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader);


const formStorage: IFormStorage | undefined = new IndexedDbFormStorage(
  "myDb",
  "myStore"
);

const externalValidators: ExternalValidators = {
  string: {
    isHex: {
      validate: (value) => /^[0-9A-F]*$/i.test(value),
    },
    isHappy: {
      params: [],
      validate: (value) => value === "Happy",
    },
    equals: {
      params: [
        { key: "value", type: "string", required: false, default: "Ring" },
        {
          key: "message",
          type: "string",
          required: false,
          default: "Value must be equals to ",
        },
      ],
      validate: (value, _, args) => {
        const errorMessage = args?.["message"] as string;
        return value !== args?.["value"] ? errorMessage ?? false : true;
      },
    },
  },
  number: {},
  boolean: {
    onlyTrue: {
      validate: (value) => value === true,
    },
  },
};

const formName = "myForm";

export const pagecreator = forwardRef(({ editorRef, ...props }) => {
  async function getFormFn(name?: string) {
    return JSON.stringify(props.template[0]);
  }

  const InternalRef = useRef<IFormViewer>(null);

  useImperativeHandle(editorRef, () => ({
    getInputValue: () => {
      console.log(InternalRef?.current?.form?.componentTree);
      return InternalRef?.current?.formData?.data;
    },
    getFormJSON: async () => {
      return  await formStorage.getForm("myForm");
    },
    saveForm: async () => {
      return await formStorage.saveForm
    }
  }));

  const localizeFn = useCallback<ComponentLocalizer>(
    (componentStore, language) => {
      return componentStore.key === "submit" && language.code === "en"
        ? { children: `Submit` }
        : {};
    },
    []
  );

  const onDataChangeFn = async (data, errors) => {
    // console.log("IternalRef== ", await formStorage.getForm("myForm"));
    console.log("data==>> ", data, errors);
  };

  return (
    <>
      <FormBuilder
        view={builderView}
        getForm={() => getFormFn(props.template[0])}
        formName={formName}
        initialData={props.template[1] || {}}
        formStorage={formStorage}
        localize={localizeFn}
        onDataChange={({ data, errors }) => {
          onDataChangeFn(data, errors);
        }}
        // onDataChange={(e) => {
        //   console.log("E",e);
          
        // }}
        viewerRef={InternalRef}
        externalValidators={externalValidators}
        externalActions={{
          assertArgs: ActionDefinition.functionalAction(
            (e, args) => {
              console.log("1", e, args);
            },
            {
              p1: "string",
              p2: "boolean",
              p3: "number",
            }
          ),
          logEventArgs: async (e) =>
            await formStorage
              .getForm("myForm")
              .then((result) => console.log("formStorage== ", result)),
        }}
      />
    </>
  );
});

export default pagecreator;
