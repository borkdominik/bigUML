package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

public class SetAttributeTypeCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected Type newType;

    public SetAttributeTypeCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                  final Type newType) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newType = newType;
    }

    @Override
    protected void doExecute() {
        Property attribute = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Property.class);
        attribute.setType(newType);
    }
}
