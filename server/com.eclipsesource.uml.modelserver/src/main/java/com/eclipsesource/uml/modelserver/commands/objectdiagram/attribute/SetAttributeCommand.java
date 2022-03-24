package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Type;

public class SetAttributeCommand extends CompoundCommand {

    public SetAttributeCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                              final String newName, final Type newType, final int newLowerBound, final int newUpperBound) {
        this.append(new SetAttributeNameCommand(domain, modelUri, semanticUriFragment, newName));
        this.append(new SetAttributeTypeCommand(domain, modelUri, semanticUriFragment, newType));
        this.append(new SetAttributeBoundsCommand(domain, modelUri, semanticUriFragment, newLowerBound, newUpperBound));
    }
}
