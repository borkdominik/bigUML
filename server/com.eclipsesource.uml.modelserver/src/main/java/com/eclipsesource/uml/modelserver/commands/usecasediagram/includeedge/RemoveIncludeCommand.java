package com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Include;

public class RemoveIncludeCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveIncludeCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Include includeToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Include.class);
        if (includeToRemove == null) {
            return;
        }
        includeToRemove.getIncludingCase().getIncludes().remove(includeToRemove);
    }
}
