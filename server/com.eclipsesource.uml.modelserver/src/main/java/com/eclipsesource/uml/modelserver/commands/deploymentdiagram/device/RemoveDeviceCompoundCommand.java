package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Model;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveDeviceCompoundCommand extends CompoundCommand {

    public RemoveDeviceCompoundCommand(final EditingDomain domain, final URI modelUri,
                                       final String semanticUriFragment, final String parentSemanticUri) {
        this.append(new RemoveDeviceCommand(domain, modelUri, semanticUriFragment, parentSemanticUri));
        this.append(new RemoveDeviceShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Device DeviceToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, Device.class);

        // TODO: check if needed at later point
        /*
         * Remove children
         * Collection<Setting> usagesNode = UsageCrossReferencer.find(nodeToRemove, umlModel.eResource());
         * for (Setting setting : usagesNode) {
         * EObject eObject = setting.getEObject();
         * if (isPropertyTypeUsage(setting, eObject, nodeToRemove)) {
         * String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
         * this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
         * }
         * }
         */

    }
}
