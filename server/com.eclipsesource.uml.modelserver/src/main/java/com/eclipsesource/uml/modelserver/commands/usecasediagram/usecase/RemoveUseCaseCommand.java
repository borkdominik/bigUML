package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

public class RemoveUseCaseCommand { /*- {

    protected final String semanticUriFragment;

    public RemoveUseCaseCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute(){
        UseCase useCaseToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, UseCase.class);
        if (useCaseToRemove == null) {
            return;
        }
        EObject container = useCaseToRemove.eContainer();
        if (container == null || container instanceof Model) {
            umlModel.getPackagedElements().remove(useCaseToRemove);
        } else if (container instanceof Package) {
            ((Package) container).getPackagedElements().remove(useCaseToRemove);
        } else if (container instanceof Component) {
            ((Component) container).getPackagedElements().remove(useCaseToRemove);
        }
    }   */
}
