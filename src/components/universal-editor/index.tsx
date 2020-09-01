import { FunctionalComponent, h, RefObject } from "preact";
import { forwardRef } from "preact/compat";


interface UniversalEditorProps {
    value: unknown;
    values?: unknown[];
    readonly?: boolean;
    onChange(value: unknown): void;
    [k: string]: unknown;
}


const UniversalEditor: FunctionalComponent<UniversalEditorProps> = forwardRef((props, ref: RefObject<HTMLInputElement | HTMLSelectElement>) => {
    const { value, values, onChange, ...rest } = props;
    const changeHandler = (event: Event) => {
        const { target } = event as unknown as { target: HTMLInputElement| HTMLSelectElement };
        switch (target.type) {
            case "checkbox":
                onChange((target as HTMLInputElement).checked);
                break;
            case "number":
                (target as HTMLInputElement).valueAsNumber != value && onChange((target as HTMLInputElement).valueAsNumber);
                break;
            default:
                target.value != value && onChange(target.value);
                break;
        }
    };
    if (values) {
        return (<select ref={ref as RefObject<HTMLSelectElement>} class="form-select" onChange={changeHandler}>
            {values.map(val => <option selected={val === value} value={val as string}>{val as string}</option>)}
        </select>)
    }
    switch (typeof value) {
        case "boolean":
            return (
                <div class="form-check form-switch">
                    <input ref={ref as RefObject<HTMLInputElement>} class="form-check-input" type="checkbox" {...rest} checked={value} onChange={changeHandler} />
                </div>
            );
        case "number":
            return <input step="any" ref={ref as RefObject<HTMLInputElement>} {...rest} type="number" value={value} onBlur={changeHandler} />;
        default:
            return <input ref={ref as RefObject<HTMLInputElement>} {...rest} type="text" value={value as string} onBlur={changeHandler} />;
    }
});
export default UniversalEditor;