package com.eclipsesource.uml.modelserver.old.diagram.common.commands;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.diagram.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class SetNameCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String newName;

    public SetNameCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                 final String newName) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newName = newName;
    }

    @Override
    protected void doExecute() {
        NamedElement elementToRename = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, NamedElement.class);
        if (newName != null && newName.length() > 0) {
            elementToRename.setName(newName);
        }
    }
}
