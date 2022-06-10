package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

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

      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);
      if (parentContainer instanceof Model) {
         ((Model) parentContainer).getPackagedElements().add(newDevice);
      } else if (parentContainer instanceof ExecutionEnvironment) {
         ((ExecutionEnvironment) parentContainer).getNestedClassifiers().add(newDevice);
      } else if (parentContainer instanceof Device) {
         ((Device) parentContainer).getNestedClassifiers().add(newDevice);
      } else if (parentContainer instanceof Node) {
         ((Node) parentContainer).getNestedClassifiers().add(newDevice);
      }

        /*EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
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
        }*/
   }

   public Device getNewDevice() {
      return newDevice;
   }
}
