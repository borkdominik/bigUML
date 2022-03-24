package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.FinalState;

import java.util.function.Supplier;

public class AddFinalStateCompoundCommand extends CompoundCommand {

    public AddFinalStateCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint finalStatePosition,
                                        final String regionUriFragment) {
        AddFinalStateCommand command = new AddFinalStateCommand(domain, modelUri, regionUriFragment);
        this.append(command);
        Supplier<FinalState> semanticResultSupplier = command::getNewFinalState;
        this.append(new AddFinalStateShapeCommand(domain, modelUri, finalStatePosition, semanticResultSupplier));
    }
}
