package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.actor;

public class AddActorCommand { /*- {

    protected final Actor newActor;
    protected final String parentSemanticUriFragment;

    public AddActorCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.newActor = UMLFactory.eINSTANCE.createActor();
        this.parentSemanticUriFragment = null;
    }

    public AddActorCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
        super(domain, modelUri);
        this.newActor = UMLFactory.eINSTANCE.createActor();
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        newActor.setName(UmlSemanticCommandUtil.getNewActorName(umlModel));
        if (parentSemanticUriFragment == null) {
            umlModel.getPackagedElements().add(newActor);
        } else {
            Package parentPackage = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Package.class);
            parentPackage.getPackagedElements().add(newActor);
        }
    }

    public Actor getNewActor() {
        return newActor;
    }   */
}
