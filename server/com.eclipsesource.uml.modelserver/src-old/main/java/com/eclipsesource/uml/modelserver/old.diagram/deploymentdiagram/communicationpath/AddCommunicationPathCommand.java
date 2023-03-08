package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.communicationpath;

public class AddCommunicationPathCommand { /*- {

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
       */
}
