package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Device;

public class AddDeviceCompoundCommand extends CompoundCommand {

    public AddDeviceCompoundCommand(final EditingDomain domain, final URI modelUri,
                                    final GPoint devicePosition, final String parentSemanticUri) {

        AddDeviceCommand command = new AddDeviceCommand(domain, modelUri, parentSemanticUri);
        this.append(command);
        Supplier<Device> semanticResultSupplier = command::getNewDevice;
        this.append(new AddDeviceShapeCommand(domain, modelUri, devicePosition, semanticResultSupplier));
    }
}
