package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Property;

public class SetAttributeBoundsCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected int newLowerBound;
    protected int newUpperBound;

    public SetAttributeBoundsCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                    final int newLowerBound, final int newUpperBound) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newLowerBound = newLowerBound;
        this.newUpperBound = newUpperBound;
    }

    @Override
    protected void doExecute() {
        Property attribute = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Property.class);
        attribute.setLower(newLowerBound);
        attribute.setUpper(newUpperBound);
    }
}
