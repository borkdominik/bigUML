package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.link;

public class AddLinkCommand { /*- {

    private final Association newLink;
    protected final Class sourceElement;
    protected final Class targetElement;

    public AddLinkCommand(final EditingDomain domain, final URI modelUri,
                              final String sourceElementUriFragment, final String targetElementUriFragment) {
        super(domain, modelUri);
        this.newLink = UMLFactory.eINSTANCE.createAssociation();
        this.sourceElement = UmlSemanticCommandUtil.getElement(umlModel, sourceElementUriFragment, Class.class);
        this.targetElement = UmlSemanticCommandUtil.getElement(umlModel, targetElementUriFragment, Class.class);
    }

    @Override
    protected void doExecute() {
        getNewLink().createOwnedEnd(UmlSemanticCommandUtil.getNewAssociationEndName(sourceElement), sourceElement);
        getNewLink().createOwnedEnd(UmlSemanticCommandUtil.getNewAssociationEndName(targetElement), targetElement);
        umlModel.getPackagedElements().add(getNewLink());
    }

    public Association getNewLink() {
        return newLink;
    }   */
}
