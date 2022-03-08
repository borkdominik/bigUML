package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.UMLFactory;

public class AddCommunicationPathCommand extends UmlSemanticElementCommand {

    private final CommunicationPath newCommunicationPath;
    protected final Classifier sourceNode;
    protected final Classifier targetNode;

    public AddCommunicationPathCommand(final EditingDomain domain, final URI modelUri,
                                       final String sourceNodeUriFragment, final String targetNodeUriFragment) {
        super(domain, modelUri);
        this.newCommunicationPath = UMLFactory.eINSTANCE.createCommunicationPath();
        this.sourceNode = UmlSemanticCommandUtil.getElement(umlModel, sourceNodeUriFragment, Classifier.class);
        this.targetNode = UmlSemanticCommandUtil.getElement(umlModel, targetNodeUriFragment, Classifier.class);
    }

    @Override
    protected void doExecute() {
        getNewCommunicationPath().createOwnedEnd(" ", sourceNode);
        getNewCommunicationPath().createOwnedEnd("New Communication Path", targetNode);
        umlModel.getPackagedElements().add(getNewCommunicationPath());
    }

    public CommunicationPath getNewCommunicationPath() { return newCommunicationPath; }
}
