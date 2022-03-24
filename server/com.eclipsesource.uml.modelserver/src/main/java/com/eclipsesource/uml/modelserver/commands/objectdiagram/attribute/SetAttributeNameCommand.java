package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Property;

public class SetAttributeNameCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String newName;

    public SetAttributeNameCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                  final String newName) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newName = newName;
    }

    @Override
    protected void doExecute() {
        Property attribute = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Property.class);
        attribute.setName(newName);
    }
}
