package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveDeviceCompoundCommand extends CompoundCommand {

    public RemoveDeviceCompoundCommand(final EditingDomain domain, final URI modelUri,
                                       final String semanticUriFragment, final String parentSemanticUri) {
        this.append(new RemoveDeviceCommand(domain, modelUri, semanticUriFragment, parentSemanticUri));
        this.append(new RemoveDeviceShapeCommand(domain, modelUri, semanticUriFragment));

        /*Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Device DeviceToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, Device.class);*/

    }
}
