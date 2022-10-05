package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

public class RemoveActorCommand { /*- {

    protected final String semanticUriFragment;

    public RemoveActorCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Actor actorToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Actor.class);
        EObject container = actorToRemove.eContainer();
        if (container == null || container instanceof Model) {
            umlModel.getPackagedElements().remove(actorToRemove);
        } else if (container instanceof Package) {
            ((Package) container).getPackagedElements().remove(actorToRemove);
        }
    }   */
}
