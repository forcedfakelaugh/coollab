// Browser preview only. This adapter does NOT establish compatibility with Framer.
export const ControlType = Object.freeze({ String: "string", Color: "color", Enum: "enum", Number: "number", Boolean: "boolean" });
export function addPropertyControls(component, controls) { component.previewControls = controls; }
export const RenderTarget = { canvas: "canvas", current: () => "preview" };
