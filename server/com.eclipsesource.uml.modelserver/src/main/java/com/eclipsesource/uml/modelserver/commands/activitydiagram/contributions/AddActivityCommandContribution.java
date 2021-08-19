package com.eclipsesource.uml.modelserver.commands.activitydiagram.contributions;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.compound.AddActivityCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.util.UmlNotationCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

public class AddActivityCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "addActivityContribution";

    public static CCompoundCommand create(final GPoint position) {
        CCompoundCommand addActivityCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addActivityCommand.setType(TYPE);
        addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
                String.valueOf(position.getX()));
        addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
                String.valueOf(position.getY()));
        return addActivityCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        GPoint position = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

        return new AddActivityCompoundCommand(domain, modelUri, position);
    }

}
