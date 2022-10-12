package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.generalization;

public class RemoveGeneralizationCommand { /*- {

    protected final String semanticUriFragment;

    public RemoveGeneralizationCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Generalization generalizationToRemove = UmlSemanticCommandUtil
                .getElement(umlModel, semanticUriFragment, Generalization.class);
        if (generalizationToRemove == null) {
            return;
        }
        EObject container = generalizationToRemove.eContainer();
        if (container instanceof UseCase) {
            ((UseCase) container).getGeneralizations().remove(generalizationToRemove);
        } else if (container instanceof Actor) {
            ((Actor) container).getGeneralizations().remove(generalizationToRemove);
        }
    }
   */
}
