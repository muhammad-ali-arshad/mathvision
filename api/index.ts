import serverModule from "../server/_core/index";

const unwrapDefault = (moduleValue: any): any =>
  moduleValue?.default && typeof moduleValue.listen !== "function"
    ? unwrapDefault(moduleValue.default)
    : moduleValue;

const app = unwrapDefault(serverModule);

export default app;
