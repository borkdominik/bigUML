package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import java.util.function.Supplier;

public class AddGeneralizationCompoundCommand extends CompoundCommand {

    public AddGeneralizationCompoundCommand(final EditingDomain domain, final URI modelUri, final String generalClassifier,
                                            final String specificClassifier) {

        AddGeneralizationCommand command = new AddGeneralizationCommand(domain, modelUri, generalClassifier,
                specificClassifier);
        this.append(command);
        Supplier<Generalization> semanticResultSupplier = command::getNewGeneralization;
        this.append(new AddGeneralizationEdgeCommand(domain, modelUri, semanticResultSupplier));
    }

}
