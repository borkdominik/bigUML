package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;

public class RemoveAttributeCommand extends UmlSemanticElementCommand {

    protected final String parentSemanticUriFragment;
    protected final String semanticUriFragment;

    public RemoveAttributeCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUriFragment,
                                 final String semanticUriFragment) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Class parentClass = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Class.class);
        Property propertyToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Property.class);
        parentClass.getOwnedAttributes().remove(propertyToRemove);
    }
}
