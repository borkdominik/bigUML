package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.UMLFactory;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddExecutionEnvironmentCommand extends UmlSemanticElementCommand {

    protected final ExecutionEnvironment newExecutionEnvironment;
    protected final String parentSemanticUriFragment;

    public AddExecutionEnvironmentCommand(final EditingDomain domain, final URI modelUri,
                                          final String parentSemanticUri) {
        super(domain, modelUri);
        this.newExecutionEnvironment = UMLFactory.eINSTANCE.createExecutionEnvironment();
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        newExecutionEnvironment.setName(UmlSemanticCommandUtil.getNewExecutionEnvironmentName(umlModel));

        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedNodes().add(newExecutionEnvironment);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedNodes().add(newExecutionEnvironment);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedNodes().add(newExecutionEnvironment);
        } else {
            umlModel.getPackagedElements().add(newExecutionEnvironment);
        }
    }

    public ExecutionEnvironment getNewExecutionEnvironment() {
        return newExecutionEnvironment;
    }
}
