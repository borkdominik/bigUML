package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveUseCaseCompoundCommand extends CompoundCommand {

    public RemoveUseCaseCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        this.append(new RemoveUseCaseCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveUseCaseShapeCommand(domain, modelUri, semanticUriFragment));

        //TODO
        //Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        //UseCase useCaseToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, UseCase.class);

    }
}
