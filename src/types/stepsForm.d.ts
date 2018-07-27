
declare interface IStepsFormOptions {
    onSubmit: (form: HTMLFormElement) => void;
}

declare interface stepsForm {
        
}

declare const stepsForm: {
    prototype: stepsForm,
    new (elementOrSelector: HTMLElement | string, options: IStepsFormOptions): stepsForm;
};

interface Window {
    stepsForm: stepsForm;
}