import { Application, ParameterType, PageEvent, RendererEvent } from 'typedoc';
import { ExternalModuleMapPlugin } from './plugin.js'

const TYPEDOC_VERSION = Application.VERSION;

export const pluginOptions = (app: Application) => ({
    options: () => {
        return {
            externalModuleMap: app.options.getValue('external-modulemap')  as string| string[]   
        }
    },
});


export function load(app: Application) {

    app.options.addDeclaration({
        name: 'external-modulemap',
        help: 'Inline rewrite map',
        type: ParameterType.Mixed,
    });

    (new ExternalModuleMapPlugin()).initialize(app);
}