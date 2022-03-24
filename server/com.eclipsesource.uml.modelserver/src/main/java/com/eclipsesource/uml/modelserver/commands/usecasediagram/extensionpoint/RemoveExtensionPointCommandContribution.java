package com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveExtensionPointCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "removeExtensionPoint";

    public static CCompoundCommand create(final String semanticUriFragment) {
        CCompoundCommand removeExtensionPointCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeExtensionPointCommand.setType(TYPE);
        removeExtensionPointCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUriFragment);
        return removeExtensionPointCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveExtensionPointCompoundCommand(domain, modelUri, semanticUriFragment);
    }
}
