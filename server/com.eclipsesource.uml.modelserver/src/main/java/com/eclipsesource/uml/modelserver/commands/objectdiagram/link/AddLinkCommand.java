package com.eclipsesource.uml.modelserver.commands.objectdiagram.link;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.UMLFactory;

public class AddLinkCommand extends UmlSemanticElementCommand {

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
    }
}
