package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

public class AddEnumerationCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addEnumerationContribution";

   public static CCompoundCommand create(final GPoint position) {
      CCompoundCommand addEnumerationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addEnumerationCommand.setType(TYPE);
      addEnumerationCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
      addEnumerationCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
      return addEnumerationCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint enumerationPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      return new AddEnumerationCompoundCommand(domain, modelUri, enumerationPosition);
   }
}
