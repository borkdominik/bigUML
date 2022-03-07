package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.UMLFactory;

public class AddDeviceCommand extends UmlSemanticElementCommand {

    protected final Device newDevice;
    protected final String parentSemanticUriFragment;

    public AddDeviceCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
        super(domain, modelUri);
        this.newDevice = UMLFactory.eINSTANCE.createDevice();
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        newDevice.setName(UmlSemanticCommandUtil.getNewDeviceName(umlModel));

        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedNodes().add(newDevice);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().add(newDevice);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().add(newDevice);
        } else {
            umlModel.getPackagedElements().add(newDevice);
        }
    }

    public Device getNewDevice() {
        return newDevice;
    }
}
