package com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Extend;

public class RemoveExtendCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveExtendCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Extend extendToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Extend.class);
        if (extendToRemove == null) {
            return;
        }
        extendToRemove.getExtension().getExtends().remove(extendToRemove);
    }
}
