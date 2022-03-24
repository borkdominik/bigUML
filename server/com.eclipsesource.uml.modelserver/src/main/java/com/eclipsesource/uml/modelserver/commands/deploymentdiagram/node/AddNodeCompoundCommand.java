package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Node;

import java.util.function.Supplier;

public class AddNodeCompoundCommand extends CompoundCommand {

    public AddNodeCompoundCommand(final EditingDomain domain, final URI modelUri,
                                  final GPoint nodePosition, final String parentSemanticUri) {

        AddNodeCommand command = new AddNodeCommand(domain, modelUri, parentSemanticUri);
        this.append(command);
        Supplier<Node> semanticResultSupplier = command::getNewNode;
        this.append(new AddNodeShapeCommand(domain, modelUri, nodePosition, semanticResultSupplier));

    }
}
