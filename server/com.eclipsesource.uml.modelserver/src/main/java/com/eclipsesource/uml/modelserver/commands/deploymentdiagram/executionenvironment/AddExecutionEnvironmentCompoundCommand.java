package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.ExecutionEnvironment;

public class AddExecutionEnvironmentCompoundCommand extends CompoundCommand {

    public AddExecutionEnvironmentCompoundCommand(final EditingDomain domain, final URI modelUri,
                                                  final GPoint executionEnvironmentPosition, final String parentSemanticUri) {

        AddExecutionEnvironmentCommand command = new AddExecutionEnvironmentCommand(domain, modelUri, parentSemanticUri);
        this.append(command);
        Supplier<ExecutionEnvironment> semanticResultSupplier = command::getNewExecutionEnvironment;
        this.append(new AddExecutionEnvironmentShapeCommand(domain, modelUri, executionEnvironmentPosition,
                semanticResultSupplier));
    }
}
