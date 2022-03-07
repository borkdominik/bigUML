package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyTypeCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UseCase;

public class RemoveUseCaseCompoundCommand extends CompoundCommand {

    public RemoveUseCaseCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        this.append(new RemoveUseCaseCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveUseCaseShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        UseCase useCaseToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, UseCase.class);
        //TODO: check if anything else needed to cleanly remove only the usecase without children!
    }


    //TODO: Add the child removing methods
}
