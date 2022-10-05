package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

public class AddUseCaseCommand { /*- {

    protected final UseCase newUseCase;
    protected final String parentSemanticUriFragment;

    public AddUseCaseCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.newUseCase = UMLFactory.eINSTANCE.createUseCase();
        this.parentSemanticUriFragment = null;
    }

    public AddUseCaseCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
        super(domain, modelUri);
        this.newUseCase = UMLFactory.eINSTANCE.createUseCase();
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        newUseCase.setName(UmlSemanticCommandUtil.getNewUseCaseName(umlModel));
        umlModel.getPackagedElements().add(newUseCase);

        if (parentSemanticUriFragment == null) {
            umlModel.getPackagedElements().add(newUseCase);
        } else {
            EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
            if (parentObject instanceof Package) {
                ((Package) parentObject).getPackagedElements().add(newUseCase);
            } else if (parentObject instanceof Component) {
                ((Component) parentObject).getPackagedElements().add(newUseCase);
            }
        }
    }

    public UseCase getNewUseCase() {
        return newUseCase;
    }   */
}
