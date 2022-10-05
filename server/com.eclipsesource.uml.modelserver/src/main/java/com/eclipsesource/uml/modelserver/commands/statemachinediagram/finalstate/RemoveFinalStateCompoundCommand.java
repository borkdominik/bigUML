package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

public class RemoveFinalStateCompoundCommand { /*-{

    public RemoveFinalStateCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String parentSemanticUriFragment, final String semanticUriFragment) {
        this.append(new RemoveFinalStateCommand(domain, modelUri, parentSemanticUriFragment, semanticUriFragment));
        this.append(new RemoveFinalStateShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        FinalState finalStateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                FinalState.class);

        Collection<Setting> usagesStateMachine = EcoreUtil.UsageCrossReferencer.find(finalStateToRemove, umlModel.eResource());
        for (Setting setting : usagesStateMachine) {
            EObject eObject = setting.getEObject();
            if (eObject instanceof Transition) {
                String transitionUri = UmlSemanticCommandUtil.getSemanticUriFragment((Transition) eObject);
                this.append(
                        new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUriFragment, transitionUri));
            }
        }
    }   */
}
