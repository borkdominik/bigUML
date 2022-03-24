package com.eclipsesource.uml.modelserver.commands.objectdiagram.link;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;

import java.util.function.Supplier;

public class AddLinkCompoundCommand extends CompoundCommand {

    public AddLinkCompoundCommand(final EditingDomain domain, final URI modelUri,
                                         final String sourceClassUriFragment, final String targetClassUriFragment) {

        // Chain semantic and notation command
        AddLinkCommand command = new AddLinkCommand(domain, modelUri, sourceClassUriFragment,
                targetClassUriFragment);
        this.append(command);
        Supplier<Association> semanticResultSupplier = command::getNewLink;
        this.append(new AddLinkEdgeCommand(domain, modelUri, semanticResultSupplier));
    }
}
