package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

public class AddArtifactCommand extends UmlSemanticElementCommand {

    protected final Artifact newArtifact;
    protected String parentSemanticUriFragment;

    public AddArtifactCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
        super(domain, modelUri);
        this.newArtifact = UMLFactory.eINSTANCE.createArtifact();
        this.parentSemanticUriFragment = parentSemanticUri;
    }

    @Override
    protected void doExecute() {
        newArtifact.setName(UmlSemanticCommandUtil.getNewArtifactName(umlModel));
        EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
        if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().add(newArtifact);
        } else if (parentObject instanceof ExecutionEnvironment) {
            ExecutionEnvironment parentExecutionEnvironment = UmlSemanticCommandUtil.getElement(umlModel,
                    parentSemanticUriFragment, ExecutionEnvironment.class);
            parentExecutionEnvironment.getNestedClassifiers().add(newArtifact);
        } else if (parentObject instanceof Node) {
            Node parentNode = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Node.class);
            parentNode.getNestedClassifiers().add(newArtifact);
        } else {
            umlModel.getPackagedElements().add(newArtifact);
        }
    }

    public Artifact getNewArtifact() { return newArtifact; }
}
