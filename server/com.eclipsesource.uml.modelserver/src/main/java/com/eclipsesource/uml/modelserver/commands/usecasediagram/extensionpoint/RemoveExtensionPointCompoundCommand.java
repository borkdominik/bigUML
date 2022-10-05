package com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint;

public class RemoveExtensionPointCompoundCommand { /*-{

    public RemoveExtensionPointCompoundCommand(final EditingDomain domain, final URI modelUri,
        final String semanticUriFragment) {

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        ExtensionPoint extensionPointToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
            ExtensionPoint.class);

        for (Relationship r : extensionPointToRemove.getRelationships()) {
            if (r instanceof Extend) {
                Extend e = (Extend) r;
                if (UmlNotationCommandUtil.getNotationElement(modelUri, domain,
                    UmlSemanticCommandUtil.getSemanticUriFragment(e), Edge.class) == null) {
                    continue;
                }
                if (e.getExtensionLocations().contains(extensionPointToRemove)) {
                    this.append(
                        new RemoveExtendCompoundCommand(domain, modelUri,
                            UmlSemanticCommandUtil.getSemanticUriFragment(e)));
                }
            }
        }

        this.append(new RemoveExtensionPointCommand(domain, modelUri, semanticUriFragment));
    }   */
}
