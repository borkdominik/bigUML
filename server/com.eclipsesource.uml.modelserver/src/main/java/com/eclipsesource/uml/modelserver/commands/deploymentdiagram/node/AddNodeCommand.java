package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

public class AddNodeCommand extends UmlSemanticElementCommand {

   protected final Node newNode;
   protected String parentSemanticUriFragment;

   public AddNodeCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newNode = UMLFactory.eINSTANCE.createNode();
      this.parentSemanticUriFragment = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      newNode.setName(UmlSemanticCommandUtil.getNewNodeName(umlModel));
      NamedElement container = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);

      if (container instanceof Model) {
         ((Model) container).getPackagedElements().add(newNode);
      } else if (container instanceof ExecutionEnvironment) {
         ((ExecutionEnvironment) container).getNestedClassifiers().add(newNode);
      } else if (container instanceof Device) {
         ((Device) container).getNestedClassifiers().add(newNode);
      } else if (container instanceof Node) {
         ((Node) container).getNestedClassifiers().add(newNode);
      }

        /*if (container instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().add(newNode);
        } else if (container instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().add(newNode);
        } else if (container instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().add(newNode);
        } else {
            umlModel.getPackagedElements().add(newNode);
        }*/

   }

   public Node getNewNode() {
      return newNode;
   }
}
