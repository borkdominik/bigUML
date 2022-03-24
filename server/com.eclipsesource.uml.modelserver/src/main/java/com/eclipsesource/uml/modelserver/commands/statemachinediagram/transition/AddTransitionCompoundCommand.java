package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Transition;

import java.util.function.Supplier;

public class AddTransitionCompoundCommand extends CompoundCommand {

    public AddTransitionCompoundCommand(final EditingDomain domain, final URI modelUri,
                                        final String containerRegionUriFragment, final String sourceClassUriFragment,
                                        final String targetClassUriFragment) {
        AddTransitionCommand command = new AddTransitionCommand(domain, modelUri, containerRegionUriFragment, sourceClassUriFragment,
                targetClassUriFragment);
        this.append(command);
        Supplier<Transition> semanticResultSupplier = command::getNewTransition;
        this.append(new AddTransitionEdgeCommand(domain, modelUri, semanticResultSupplier));
    }
}
