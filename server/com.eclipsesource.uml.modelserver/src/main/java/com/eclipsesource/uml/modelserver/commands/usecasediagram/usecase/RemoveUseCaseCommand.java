package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UseCase;
import org.eclipse.uml2.uml.internal.impl.ModelImpl;

public class RemoveUseCaseCommand extends UmlSemanticElementCommand {

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
        if (container == null || container instanceof ModelImpl) {
            umlModel.getPackagedElements().remove(useCaseToRemove);
        } else if (container instanceof Package) {
            ((Package) container).getPackagedElements().remove(useCaseToRemove);
        } else if (container instanceof Component) {
            ((Component) container).getPackagedElements().remove(useCaseToRemove);
        }
    }
}
