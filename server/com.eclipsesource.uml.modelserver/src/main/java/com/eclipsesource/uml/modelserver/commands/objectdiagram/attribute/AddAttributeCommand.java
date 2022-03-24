package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.UMLFactory;

public class AddAttributeCommand extends UmlSemanticElementCommand {

    protected final String parentSemanticUriFragment;

    public AddAttributeCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUriFragment) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Class parentClass = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Class.class);
        Property newAttribute = UMLFactory.eINSTANCE.createProperty();
        newAttribute.setName(UmlSemanticCommandUtil.getNewAttributeName(parentClass));
        parentClass.getOwnedAttributes().add(newAttribute);
    }
}
