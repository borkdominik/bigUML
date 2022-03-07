package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;
import org.eclipse.uml2.uml.UseCase;

public class AddUseCaseCommand extends UmlSemanticElementCommand {

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
            EObject parent = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
            if (parent instanceof Package) {
                ((Package) parent).getPackagedElements().add(newUseCase);
            } else if (parent instanceof Component) {
                ((Component) parent).getPackagedElements().add(newUseCase);
            }
        }
    }

    public UseCase getNewUseCase() {
        return newUseCase;
    }
}
