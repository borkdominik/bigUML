package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

public class RemoveComponentCompoundCommand { /*-{

    public RemoveComponentCompoundCommand(final EditingDomain domain, final URI modelUri,
                                          final String semanticUriFragment) {

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Component componentToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Component.class);

        for (PackageableElement elem : componentToRemove.getPackagedElements()) {
            if (elem instanceof UseCase) {
                //String uri = UmlNotationCommandUtil.getSemanticProxyUri(elem);
                this.append(new RemoveUseCaseCompoundCommand(domain, modelUri, semanticUriFragment));
            }
        }

        this.append(new RemoveComponentCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveComponentShapeCommand(domain, modelUri, semanticUriFragment));
    }   */
}
