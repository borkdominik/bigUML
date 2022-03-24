package com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

public class AddExtendCommand extends UmlSemanticElementCommand {

    private final Extend newExtend;
    protected final UseCase extendingUseCase;
    protected final UseCase extendedUseCase;
    protected final ExtensionPoint extensionPoint;

    public AddExtendCommand(final EditingDomain domain, final URI modelUri, final String extendingUseCaseUri,
                            final String extendedUseCaseUri) {
        super(domain, modelUri);
        this.newExtend = UMLFactory.eINSTANCE.createExtend();
        this.extendingUseCase = UmlSemanticCommandUtil.getElement(umlModel, extendingUseCaseUri, UseCase.class);
        //this.extendedUseCase = UmlSemanticCommandUtil.getElement(umlModel, extendedUseCaseUri, UseCase.class);
        EObject target = UmlSemanticCommandUtil.getElement(umlModel, extendedUseCaseUri);
        if (target instanceof UseCase) {
            this.extendedUseCase = (UseCase) target;
            this.extensionPoint = null;
        } else {
            this.extensionPoint = (ExtensionPoint) target;
            this.extendedUseCase = ((ExtensionPoint) target).getUseCase();
        }
    }

    @Override
    protected void doExecute() {
        extendingUseCase.getExtends().add(getNewExtend());
        ExtensionPoint newExtensionPoint;
        if (extensionPoint == null) {
            newExtensionPoint = UMLFactory.eINSTANCE.createExtensionPoint();
            int noOfExtenstionPoints = extendedUseCase.getExtensionPoints().size();
            newExtensionPoint.setName("newExtensionPoint_" + (noOfExtenstionPoints + 1));
            extendedUseCase.getExtensionPoints().add(newExtensionPoint);
        } else {
            newExtensionPoint = extensionPoint;
        }
        getNewExtend().setExtendedCase(extendedUseCase);
        getNewExtend().setExtension(extendingUseCase);
        getNewExtend().getExtensionLocations().add(newExtensionPoint);
        //umlModel.getPackagedElements().add((PackageableElement) getNewExtend());
    }

    public Extend getNewExtend() {
        return newExtend;
    }
}
